import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  constructor() {}

  setComponentPageTitle(
    router: Router,
    route: ActivatedRoute,
    titleService: Title,
    pageTitle: string
  ) {
    router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => {
          let child = route.firstChild;
          while (child) {
            if (child.firstChild) child = child.firstChild;
            else if (child.snapshot.data && child.snapshot.data['title'])
              return child.snapshot.data['title'];
            else return null;
          }
          return null;
        })
      )
      .subscribe((data: any) => {
        if (data) titleService.setTitle(`${data} — ${pageTitle}`);
      });
  }
}
