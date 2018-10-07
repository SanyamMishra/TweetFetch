import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tweetHTML;
  constructor(private http: Http) { }

  onSearchItemSelect(selectedItem) {
    this.displayTweets(selectedItem.screen_name);
  }

  private displayTweets(screen_name) {
    this.http.get(`http://localhost/tweets?screen_name=${screen_name}`).subscribe(data => {
      const ids = data.json();
      document.getElementById('container').innerHTML = '';
      for (const id of ids) {
        (<any>window).twttr.widgets.createTweet(
          id,
          document.getElementById('container')
        );
      }
    });
  }
}
