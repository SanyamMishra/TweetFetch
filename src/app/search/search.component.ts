import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { Http } from '@angular/http';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'user-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @ViewChild('input') input: ElementRef;

  @Output() selected = new EventEmitter();

  myControl = new FormControl();
  searchItems: any[];
  searchHistory = [];

  constructor(private http: Http) { }

  ngOnInit() {
    fromEvent(this.input.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged(),
        filter(query => !!query),
        switchMap(query => {
          if (query) {
            return this.http.get(`https://www.tweetfetch.tk/search?query=${query}`);
          }
        })
      )
      .subscribe((val) => {
        this.searchItems = val.json();
      });
  }

  onSelection(data) {
    this.myControl.reset();
    this.searchItems = [];

    const index = this.searchHistory.findIndex(item => item.screen_name === data.option.value.screen_name);
    if (index !== -1) {
      this.searchHistory.splice(index, 1);
    }
    this.searchHistory.unshift(data.option.value);

    this.selected.emit(data.option.value);
  }
}
