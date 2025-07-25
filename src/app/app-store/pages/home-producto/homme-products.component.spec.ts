import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HommeProductsComponent } from './homme-products.component';

describe('HommeProductsComponent', () => {
  let component: HommeProductsComponent;
  let fixture: ComponentFixture<HommeProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HommeProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HommeProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
