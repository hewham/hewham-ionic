import { Component, OnInit } from '@angular/core';
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
      if(domain.slice(domain.length - 8) != 'penna.io') {
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
        this.domainVerifyData = res.error;
      }
    }
    this.isDomainLoading = false;
  }

  async updateCustomDomain() {
    // console.log("this.customdomain: ", this.customdomain)
    if(this.validateService.isValidDomainName(this.customdomain)) {
      this.errorMessage = "";
      try{
        let res = await this.functionsService.call("addDomain", { domain: this.customdomain });
      } catch (err) {
        this.errorMessage = "Something went wrong";
      }
    } else {
      this.errorMessage = "Please enter a valid domain name";
    }
  }

}
