import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  
  constructor(){}

  projects = {
    anonacy: {
      id: "anonacy",
      name: "Anonacy",
      subtitle: "Anonymity + Privacy",
      description: "Anonacy is a platform built to help people anonymize their information when they use services on the internet. It's core features include email masks, sms aliases, and identity generators.",
      logo: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/anonacy-logo.png?alt=media&token=dedb9e9a-a9f6-4c23-9530-fd59bc0bba45",
      icon: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/anonacy-icon.png?alt=media&token=f93e95c2-36ca-4e23-ace8-b0721eb5ef3a",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/anonacy-splash2.png?alt=media&token=91ff5d9e-4cbd-4abb-b854-6e583fc56540",
      image: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/logo_icon.png?alt=media&token=07901b5e-cb34-4dfb-ba1e-3fdc64821297",
      html: ``
    },
    giggot: {
      id: "giggot",
      name: "GigGot",
      subtitle: "The all in one live performance platform",
      description: "GigGot is an app I made to help people find performing artists. It started as a simpler way to book my DJ friends for houseparties in college. It turned into a full booking management platform for bars, venues, and everyone else.",
      logo: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/giggot-logo-black.png?alt=media&token=84e146df-9f59-412d-84b4-4a01e757fd48",
      icon: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/giggot-icon.png?alt=media&token=e267a5da-037e-40e2-a19d-425e4d440391",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/giggot-splash.png?alt=media&token=3b6d4e93-87ee-4cdd-b592-afa06d2ea0ef",
      image: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/giggot_artist.png?alt=media&token=2e95d431-cd96-4c6c-8367-46b7d5b25766",
      html: ``
    },
  }

  js = {
    space: {
      id: "space",
      name: "Space.js",
      subtitle: "Blast 'em",
      description: "Asteroids in vanilla js with p5.js. Use arrow keys to move, space bar to shoot. May need to click in frame to gain control.",
      icon: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/spacejs%202.png?alt=media&token=91ef2047-cf83-4802-99a3-387eac4655b4",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/spacejs.png?alt=media&token=7e6639a9-b086-4ae8-92f7-68f7f064cd2f",
    }
  }

}