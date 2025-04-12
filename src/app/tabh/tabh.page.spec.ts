import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabhPage } from './tabh.page';

describe('TabhPage', () => {
  let component: TabhPage;
  let fixture: ComponentFixture<TabhPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabhPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
