import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabrPage } from './tabr.page';

describe('TabrPage', () => {
  let component: TabrPage;
  let fixture: ComponentFixture<TabrPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
