import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  
  constructor(){}

  delay(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, ms)
    })
  }

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
    todoolie: {
      id: "todoolie",
      name: "ToDoolie",
      subtitle: "ToDoolie is a quick and easy way for homeowners to book jobs",
      description: "I am Vice President of Technology at ToDoolie, a Detroit based start up designed to let homeowners book students to do simple tasks around the house.",
      logo: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/todoolie-logo-blue.png?alt=media&token=5005a929-2744-46e4-bfc9-cd1877e26574",
      icon: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/todoolie-icon.png?alt=media&token=540f2324-6137-4470-9f36-6529530ab12c",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/todoolie-splash-gif.gif?alt=media&token=5ce7dfbd-89b1-4617-9a40-a0d05eb68d50",
      // cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/todoolie-splash1.png?alt=media&token=68807064-97e8-42d4-963a-942bd3b793ce",
      image: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/todoolie-icon.png?alt=media&token=540f2324-6137-4470-9f36-6529530ab12c",
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
    }
  }

  js = {
    Space: {
      id: "Space",
      name: "Space.js",
      subtitle: "Blast 'em",
      description: "Asteroids in vanilla js with p5.js. Use arrow keys to move, space bar to shoot. May need to click in frame to gain control.",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/spacejs.png?alt=media&token=7e6639a9-b086-4ae8-92f7-68f7f064cd2f",
    },
    SmartSearchers: {
      id: "SmartSearchers",
      name: "SmartSearchers.js",
      subtitle: "Neural Network",
      description: "Nueral network created in vanilla js",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/smart-searchers.png?alt=media&token=40e24621-8962-460f-9cf3-7d55a97406bf",
    },
    AnimatedText: {
      id: "AnimatedText",
      name: "AnimatedText.js",
      subtitle: "Animated Text",
      description: "Live text effects on mouse over in vanilla js",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/animated-text.png?alt=media&token=b36c2203-fe5c-437d-ac74-5dde1d8b44f9",
    },
    Plinko: {
      id: "Plinko",
      name: "Plinko.js",
      subtitle: "Plinko",
      description: "Simple gravity simulation in vanilla js",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/Plinko.png?alt=media&token=3fb31228-46c6-42d2-82e9-34fadc3416e3",
    },
    SmartRockets: {
      id: "SmartRockets",
      name: "SmartRockets.js",
      subtitle: "Smart Rockets",
      description: "Nueral network in vanilla js. Rockets are trained to attempt to reach the goal.",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/smart-rockets.png?alt=media&token=78149a20-dc22-4299-ae26-68562a34fed8",
    },
    BasketBall: {
      id: "BasketBall",
      name: "Basketball.js",
      subtitle: "Basketball",
      description: "Simple gravity simulator + ball shooting game. Control angle with arrow keys. Shoot with space bar.",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/basketball.png?alt=media&token=69892103-469b-41e5-b599-ab1bdb20a5d4",
    },
    Minesweeper: {
      id: "Minesweeper",
      name: "Minesweeper.js",
      subtitle: "Minesweeper",
      description: "Minesweeper recreated in vanilla js",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/minesweeper.png?alt=media&token=4ce0100a-87f2-444b-bb13-1a4140ff2a82",
    },
    Spiral: {
      id: "Spiral",
      name: "Spiral.js",
      subtitle: "Spiral",
      description: "Silly code art",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/spiral.png?alt=media&token=838c0d7d-4da6-4f56-86af-448bbcde3c97",
    },
    Colonizer: {
      id: "Colonizer",
      name: "Colonizer.js",
      subtitle: "Colonizer",
      description: "Node connector made in vanilla js",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/coloizer.png?alt=media&token=280f0c68-eb72-4103-ad3e-ee313ae90e7f",
    },
    DoublePendulum: {
      id: "DoublePendulum",
      name: "DoublePendulum.js",
      subtitle: "DoublePendulum",
      description: "Chaos",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/pendulum.png?alt=media&token=e38b8c5b-589d-4546-b27e-a65cf9d0b66f",
    },
    FractalTree: {
      id: "FractalTree",
      name: "FractalTree.js",
      subtitle: "FractalTree",
      description: "Fractal generator in vanilla js",
      cover: "https://firebasestorage.googleapis.com/v0/b/hewham-ionic.appspot.com/o/fractal.png?alt=media&token=44c9d172-00bc-407d-9215-c770fed47a26",
    }
  }
}
