import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabdPage } from './tabd.page';

describe('TabdPage', () => {
  let component: TabdPage;
  let fixture: ComponentFixture<TabdPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
