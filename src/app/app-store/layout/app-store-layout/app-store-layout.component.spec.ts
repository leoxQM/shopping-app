import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStoreLayoutComponent } from './app-store-layout.component';

describe('AppStoreLayoutComponent', () => {
  let component: AppStoreLayoutComponent;
  let fixture: ComponentFixture<AppStoreLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppStoreLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppStoreLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
