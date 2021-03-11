import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-icon-select',
  templateUrl: './icon-select.component.html',
  styleUrls: ['./icon-select.component.scss']
})
export class IconSelectComponent implements OnInit{

  @Output() onSelect: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  select(icon) {
    this.onSelect.emit(icon);
  }

  icons = ["add","add-circle","airplane","alarm","albums","alert","american-football","analytics","aperture","apps","archive","arrow-back","arrow-down","arrow-forward","arrow-up","at","attach","backspace","barcode","baseball","basket","basketball","battery-charging","battery-dead","battery-full","beaker","bed","beer","bicycle","bluetooth","boat","body","bonfire","book","bookmark","bookmarks","briefcase","browsers","brush","bug","build","bulb","bus","business","cafe","calculator","calendar","call","camera","car","card","cart","cash","cellular","chatbubbles","checkbox","checkmark","checkmark-circle","clipboard","close","close-circle","cloud","cloud-circle","cloud-done","cloud-download","cloud-upload","cloudy","cloudy-night","code","code-download","code-working","cog","color-fill","color-filter","color-palette","color-wand","compass","construct","contract","contrast","copy","create","crop","cube","cut","desktop","disc","document","download","easel","egg","exit","expand","eye","eye-off","female","film","finger-print","fitness","flag","flame","flash","flash-off","flashlight","flask","flower","folder","folder-open","football","funnel","gift","git-branch","git-commit","git-compare","git-merge","git-network","git-pull-request","glasses","globe","grid","hammer","happy","headset","heart","heart-dislike","heart-half","help","help-buoy","help-circle","home","hourglass","ice-cream","image","images","infinite","information","information-circle","journal","key","keypad","laptop","leaf","link","list","locate","log-in","log-out","magnet","mail","mail-open","mail-unread","male","man","map","medal","medical","medkit","megaphone","menu","mic","mic-off","moon","move","musical-note","musical-notes","navigate","notifications","notifications-off","nuclear","nutrition","open","options","paper-plane","partly-sunny","pause","paw","people","person","person-add","phone-landscape","phone-portrait","pin","pint","pizza","planet","play","play-circle","podium","power","pricetag","pricetags","print","pulse","radio","radio-button-off","radio-button-on","rainy","recording","refresh","refresh-circle","remove","remove-circle","repeat","resize","restaurant","ribbon","rocket","rose","sad","save","school","search","send","settings","share","shirt","shuffle","snow","speedometer","square","star","star-half","stopwatch","subway","sunny","sync","tablet-landscape","tablet-portrait","tennisball","text","thermometer","thumbs-down","thumbs-up","thunderstorm","time","timer","today","train","transgender","trash","trending-down","trending-up","trophy","tv","umbrella","videocam","volume-high","volume-low","volume-mute","volume-off","walk","wallet","warning","watch","water","wifi","wine","woman"]
}
