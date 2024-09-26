import { Component, inject } from '@angular/core';
import { TableComponent } from '../../ui/table/table.component';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../data-access/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [TableComponent, RouterLink],
  templateUrl: './task-list.component.html',
  providers: [TaskService], //PARA INYECTAR EL TASKSERVICE SI TENER ALLA EL ROOT EN EL @INJECTABLE()
})
export default class TaskListComponent {
  tasksService = inject(TaskService);
}
