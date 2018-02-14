import { AuthService } from './auth.service';
import { TestBed, async, inject } from '@angular/core/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { setupMockStore } from 'testing-helpers/testing-helpers.module.hlpr';

describe('auth.service', () => {

  const mockUserActions = jasmine.createSpyObj('mockUserActions', ['setCurrentUser']);
  const authService = new AuthService(mockUserActions);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgReduxTestingModule,
      ],
      providers: [
      ],
    });
  });

  describe('loginUser()', () => {
    it('should call UserActions.setCurrentUser()', () => {
      const users = [{userName: 'user1'}, {userName: 'user2'}];

      setupMockStore(['user', 'users'], users );
      authService.loginUser('user1', 'password');
      expect(mockUserActions.setCurrentUser).toHaveBeenCalledWith(users[0]);
    });
  });

});
