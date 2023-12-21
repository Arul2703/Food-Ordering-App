import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { LogService } from './log.service';

describe('LogService', () => {
  let service: LogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      providers:[LogService]
    });
    service = TestBed.inject(LogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should log error with details',()=>{
    const mockError = {message:'An error occured while signing up'};
    const message = 'Signup Error';
    spyOn<any>(service, 'sendLog');
    service.logErrorWithDetails(message,mockError);
    expect(service['sendLog']).toHaveBeenCalledWith('Error',message,mockError);

  })
  it('should call logInfo',()=>{
    const message = 'Login Successful';
    spyOn<any>(service,'sendLog');
    service.logInfo(message);
    expect(service['sendLog']).toHaveBeenCalledWith('Information',message,null)
  })

  it('should handle the empty inputs gracefully',()=>{
    spyOn<any>(service,'sendLog');
    service.logInfo('');
    service.logWarn('');
    expect(service['sendLog']).toHaveBeenCalledTimes(2);
  })

  it('should handle complex error messages',()=>{
    const mockError = {message:'This is an error message'};
    const stackError = new Error('This is the stack error');
    spyOn<any>(service,'sendLog');
    service.logErrorWithDetails('An error occured while login',mockError);
    service.logErrorWithDetails('An error occured while login',stackError);
    expect(service['sendLog']).toHaveBeenCalledTimes(2);
    
  })
});
