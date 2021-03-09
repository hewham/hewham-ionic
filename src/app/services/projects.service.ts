import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  
  constructor(){}

  projects = {
    giggot: {
      id: "giggot",
      name: "GigGot",
      logo: "",
      subtitle: "The all in one live performance platform",
      description: "GigGot is an app I made to help people find performing artists. It started as a simpler way to book my DJ friends for houseparties in college. It turned into a full booking management platform for bars, venues, and everyone else.",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/giggot_phones.png?alt=media&token=2a3881af-6c3e-4e16-9752-1e3ebe00fe95",
      image: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/giggot_artist.png?alt=media&token=2e95d431-cd96-4c6c-8367-46b7d5b25766",
      html: ``
    },
    anonacy: {
      id: "anonacy",
      name: "Anonacy",
      logo: "",
      subtitle: "Anonymity + Privacy",
      description: "Anonacy is a platform built to help people anonymize their information when they use services on the internet. It's core features include email masks, sms aliases, and identity generators.",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/RoundedIcon.png?alt=media&token=4ad122f2-d2e4-4cda-8a3e-e30474067cb5",
      image: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/logo_icon.png?alt=media&token=07901b5e-cb34-4dfb-ba1e-3fdc64821297",
      html: ``
    },
  }

}