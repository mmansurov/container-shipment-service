import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TemplateService } from './template.service';
import { Template } from '../models/template.model';
import { environment } from '../../environments/environment';

describe('TemplateService', () => {
  let service: TemplateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TemplateService]
    });
    service = TestBed.inject(TemplateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch templates on initialization', () => {
    // Given
    const mockTemplates: Template[] = [
      { id: 1, name: 'Template 1' },
      { id: 2, name: 'Template 2' }
    ];
    let receivedTemplates: Template[] | undefined;

    // When
    service.templates$.subscribe(templates => {
      receivedTemplates = templates;
    });

    // Then
    const req = httpMock.expectOne(`${environment.apiUrl}/templates`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTemplates);
    expect(receivedTemplates).toEqual(mockTemplates);
  });
});
