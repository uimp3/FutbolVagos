import { Component } from '@angular/core';
import { CardComponent, CardBodyComponent, RowComponent, ColComponent, ContainerComponent } from '@coreui/angular';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  imports: [CardComponent, CardBodyComponent, RowComponent, ColComponent, ContainerComponent]
})
export class DashboardComponent {

}