import { Component } from '@angular/core';
import { RowComponent, ColComponent, ContainerComponent } from '@coreui/angular';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [RowComponent, ColComponent, ContainerComponent]
})
export class DashboardComponent {

}