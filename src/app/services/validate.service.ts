import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor(
    private authService: AuthService
  ) {}

  isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  isValidDomainName(domain) {
    const DOMAIN_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if(DOMAIN_REGEX.test(domain)) {
      return true;
    } else {
      return false;
    }
  }

  validateSubdomain(subdomain) {
    const MIN_LENGTH = 3;
    const MAX_LENGTH = 32;
    const ALPHA_NUMERIC_REGEX = /^[a-z][a-z\-]*[a-z0-9]*$/;
    const START_END_HYPHEN_REGEX = /\A[^-].*[^-]\z/i;
    const reservedNames = this.authService.reservedNames;

     //if is reserved...
     if (reservedNames.includes(subdomain)) {
       return {
         errorMessage: 'Subdomain cannot be a reserved name',
         success: false
       }
     }

    //if is too small or too big...
    if (subdomain.length < MIN_LENGTH || subdomain.length > MAX_LENGTH) {
      return {
        errorMessage: `Subdomain must have between ${MIN_LENGTH} and ${MAX_LENGTH} characters`,
        success: false
      }
    }

    //if subdomain is started/ended with hyphen or is not alpha numeric
    if (!ALPHA_NUMERIC_REGEX.test(subdomain)) {
      return {
        errorMessage: 'Subdomain must only contain lowercase letters or numbers',
        success: false
      }
    }

    return {
      errorMessage: '',
      success: true
    }
  }


  validateSlug(slug) {
    const MIN_LENGTH = 1;
    const MAX_LENGTH = 32;
    const ALPHA_NUMERIC_REGEX = /^[a-z][a-z\-]*[a-z0-9]*$/;
    const START_END_HYPHEN_REGEX = /\A[^-].*[^-]\z/i;

    //if is too small or too big...
    if (slug.length < MIN_LENGTH || slug.length > MAX_LENGTH) {
      return {
        errorMessage: `Slug must have between ${MIN_LENGTH} and ${MAX_LENGTH} characters`,
        success: false
      }
    }

    //if slug is started/ended with hyphen or is not alpha numeric
    if (!ALPHA_NUMERIC_REGEX.test(slug)) {
      return {
        errorMessage: 'Slug must only contain lowercase letters or numbers',
        success: false
      }
    }

    return {
      errorMessage: "",
      success: true
    }
  }

}
