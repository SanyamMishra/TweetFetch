import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { Http } from '@angular/http';

@Component({
  selector: 'user-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @ViewChild('input') input: ElementRef;

  @Output() selected = new EventEmitter();

  searchItems: any[];

  constructor(private http: Http) { }

  ngOnInit() {
    fromEvent(this.input.nativeElement, 'input')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(500),
        distinctUntilChanged(),
        filter(query => !!query),
        switchMap(query => {
          if(query)
          return this.http.get(`http://localhost/search?query=${query}`);
        })
      )
      .subscribe((val) => {
        this.searchItems = val.json();
      });
  }

  onClick(item) {
    this.searchItems = [];
    this.selected.emit(item);
  }
}
