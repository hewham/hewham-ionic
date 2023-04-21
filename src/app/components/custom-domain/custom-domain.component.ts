import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { FirestoreService } from '../../services/firestore.service'
import { FunctionsService } from '../../services/functions.service'
import { ValidateService } from '../../services/validate.service'

@Component({
  selector: 'app-custom-domain',
  templateUrl: './custom-domain.component.html',
  styleUrls: ['./custom-domain.component.scss'],
})
export class CustomDomainComponent implements OnInit {

  // @Output() onRefresh: EventEmitter<any> = new EventEmitter();
  errorMessage = "";
  customdomain: any = null;
  hasCustomDomain: boolean = false;
  isDomainLoading: boolean = true;
  isDomainVerified: boolean = false;
  domainVerifyData = {};

  constructor(
    public authService: AuthService,
    private firestoreService: FirestoreService,
    private functionsService: FunctionsService,
    private validateService: ValidateService,
  ) { }

  async ngOnInit() {
    await this.authService.onReady();
    this.setDomains();
  }

  async setDomains() {
    this.isDomainLoading = true;
    for (let domain of this.authService.user.domains) {
      if(domain.slice(domain.length - 8) != 'unnoun.com') {
        this.hasCustomDomain = true;
        this.customdomain = domain;
      }
    }
    if(this.customdomain) {
      let res:any = await this.functionsService.call("verifyDomain", { domain: this.customdomain });
      if(res.success) {
        this.isDomainVerified = true;
        this.domainVerifyData = res.data;
      } else {
        this.isDomainVerified = false;
        if(res.error.code == "forbidden") {
          this.domainVerifyData = "forbidden"
        }  else {
          this.domainVerifyData = res.error;
        }
      }
    }
    this.isDomainLoading = false;
  }

  async refresh() {
    await this.authService.refreshUser();
    this.ngOnInit();
  }

  async updateCustomDomain() {
    this.isDomainLoading = true;
    if(this.validateService.isValidDomainName(this.customdomain)) {
      this.errorMessage = "";
      try{
        let res:any = await this.functionsService.call("addDomain", { domain: this.customdomain });
        if(res.success) {
          // nice
          await this.firestoreService.addDomainToUser(this.customdomain);
          this.refresh();
        } else {
          this.errorMessage = res.message;
        }
      } catch (err) {
        this.errorMessage = "Something went wrong";
      }
    } else {
      this.errorMessage = "Please enter a valid domain name";
    }
    this.isDomainLoading = false;
  }


}
