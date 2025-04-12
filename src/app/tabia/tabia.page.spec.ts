import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabiaPage } from './tabia.page';

describe('TabiaPage', () => {
  let component: TabiaPage;
  let fixture: ComponentFixture<TabiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
