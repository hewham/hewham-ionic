import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../services/projects.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.page.html',
  styleUrls: ['./portfolio.page.scss'],
})
export class PortfolioPage implements OnInit {
  
  public portfolio: string;
  Object = Object;

  constructor(
    private activatedRoute: ActivatedRoute,
    public projectsService: ProjectsService
  ) { }

  ngOnInit() {
    this.portfolio = this.activatedRoute.snapshot.paramMap.get('id');
  }

}
