import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsToolbar } from './actions-toolbar';

describe('ActionsToolbar', () => {
  let component: ActionsToolbar;
  let fixture: ComponentFixture<ActionsToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionsToolbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsToolbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
