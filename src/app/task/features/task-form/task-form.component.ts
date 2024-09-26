import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { isRequired } from '../../utils/validators';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Task, TaskCreate, TaskService } from '../../data-access/task.service';

export interface FormTaskForm {
  title: FormControl<string | null>;
  completed: FormControl<boolean | null>;
}

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  providers: [TaskService],
})
export default class TaskFormComponent {
  private _formBuilder = inject(FormBuilder);
  private _taskService = inject(TaskService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute); //
  private _id = this._route.snapshot.paramMap.get('id');

  isRequired(field: 'title') {
    return isRequired(field, this.form)
  }

  loading = signal(false); //para decir que se esta guardando en el button mientras realiza el proceso de guardado (true).

  form = this._formBuilder.group<FormTaskForm>({
    title: this._formBuilder.control('', Validators.required),
    completed: this._formBuilder.control(false, Validators.required),
  })

  ngOnInit() { ///
    const taskId = this._route.snapshot.paramMap.get('id');
    if (taskId) {
      this.loadTask(taskId);
    }
  }

  private async loadTask(taskId: string) { ////
    // Aquí deberías implementar la lógica para obtener la tarea por ID
    const task: Task | undefined = await this._taskService.getTaskById(taskId);
    if (task) {
      this.form.patchValue({
        title: task.title,
        completed: task.completed,
      });
    }
  }

  async submit() {
    if (this.form.invalid) return;

    try {
      this.loading.set(true);
      const { title, completed } = this.form.value;
      const task: TaskCreate = {
        title: title || '',
        completed: !!completed,
      }

      if (this._id) {
        await this._taskService.update(this._id, task); // Llama al método de actualización
      } else {
        await this._taskService.create(task);
      }

      toast.success(`Tarea ${this._id ? 'actualizada' : 'creada'} correctamente!`);
      this._router.navigateByUrl('/tasks');
    } catch (error) {
      toast.error('Ocurrio un error al guardar la tarea');
    }finally{
      this.loading.set(false);
    }
  }
}
