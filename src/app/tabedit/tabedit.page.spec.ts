import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabeditPage } from './tabedit.page';

describe('TabeditPage', () => {
  let component: TabeditPage;
  let fixture: ComponentFixture<TabeditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabeditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
