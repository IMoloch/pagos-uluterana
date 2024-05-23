import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SemestersPage } from './semesters.page';

describe('SemestersPage', () => {
  let component: SemestersPage;
  let fixture: ComponentFixture<SemestersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SemestersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
