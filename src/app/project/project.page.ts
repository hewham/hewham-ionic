import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {
  public project: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.project = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
