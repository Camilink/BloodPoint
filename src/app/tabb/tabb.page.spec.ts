import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabbPage } from './tabb.page';

describe('TabbPage', () => {
  let component: TabbPage;
  let fixture: ComponentFixture<TabbPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabbPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
