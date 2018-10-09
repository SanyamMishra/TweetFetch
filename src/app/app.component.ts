import { Component, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  fetchingTweets = false;

  constructor(private http: Http, private ref: ChangeDetectorRef, private afs: AngularFirestore) {
    this.bindTweetRenderedEvent();
  }

  bindTweetRenderedEvent() {
    (<any>window).twttr.ready(
      twttr => {
        twttr.events.bind(
          'rendered',
          event => {
            if (this.fetchingTweets) {
              this.fetchingTweets = false;
              this.ref.detectChanges();
            }
          }
        );
      }
    );
  }

  onSearchItemSelect(selectedItem) {
    this.displayTweets(selectedItem.screen_name);
  }

  displayTweets(screen_name) {
    // clearing current tweets and adding spinner
    document.getElementById('tweets-container').innerHTML = '';
    this.fetchingTweets = true;

    // querying firebase for tweet ids
    const query = this.afs.collection(
      'twitter_handles',
      ref => ref.where('screen_name', '==', screen_name)
    )
      .valueChanges()
      .subscribe(data => {
        if (data.length) {
          console.log('got tweet ids from firestore');
          this.renderTweets((<any>data[0]).tweetIDs);
        } else {
          this.getTweetsfromTwitter(screen_name);
        }

        query.unsubscribe();
      });
  }

  private getTweetsfromTwitter(screen_name) {
    console.log('got tweets from twitter');
    this.http.get(`https://www.tweetfetch.tk/tweets?screen_name=${screen_name}`).subscribe(data => {
      const ids = data.json();
      this.renderTweets(ids);
      this.afs.collection('twitter_handles').add({
        screen_name: screen_name,
        tweetIDs: ids
      });
    });
  }

  private renderTweets(ids) {
    for (const id of ids) {
      (<any>window).twttr.widgets.createTweet(
        id,
        document.getElementById('tweets-container')
      );
    }
  }
}
