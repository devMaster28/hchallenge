import { parseDocumentsResponse } from './documentDto';

describe('parseDocumentsResponse', () => {
  it('parses documents received from the backend', () => {
    // Arrange
    const document = {
      ID: 'document-id',
      CreatedAt: '2026-08-15T10:00:00.000Z',
      UpdatedAt: '2026-08-15T11:00:00.000Z',
      Title: 'Annual report',
      Attachments: ['report.pdf', null],
      Contributors: [{ ID: 'user-id', Name: 'Alicia Wolf' }, null],
      Version: '2.1.0',
    };

    // Act
    const result = parseDocumentsResponse([document]);

    // Assert
    expect(result).toEqual([document]);
  });

  it('accepts missing and nullable contract properties', () => {
    // Arrange
    const response = [
      {
        ID: null,
        Attachments: null,
        Contributors: [{ Name: 'Alicia Wolf' }],
      },
    ];
    const expected = [
      {
        ID: null,
        CreatedAt: undefined,
        UpdatedAt: undefined,
        Title: undefined,
        Attachments: null,
        Contributors: [{ ID: undefined, Name: 'Alicia Wolf' }],
        Version: undefined,
      },
    ];

    // Act
    const result = parseDocumentsResponse(response);

    // Assert
    expect(result).toEqual(expected);
  });

  it('ignores properties outside the known backend contract', () => {
    // Arrange
    const response = [{ ID: 'document-id', NewProperty: true }];
    const expected = [
      {
        ID: 'document-id',
        CreatedAt: undefined,
        UpdatedAt: undefined,
        Title: undefined,
        Attachments: undefined,
        Contributors: undefined,
        Version: undefined,
      },
    ];

    // Act
    const result = parseDocumentsResponse(response);

    // Assert
    expect(result).toEqual(expected);
  });

  it('rejects a response that is not an array', () => {
    // Arrange
    const response = {};

    // Act
    const parse = () => parseDocumentsResponse(response);

    // Assert
    expect(parse).toThrow('documents must be an array');
  });

  it('rejects document properties with an unexpected type', () => {
    // Arrange
    const response = [{ Title: 42 }];

    // Act
    const parse = () => parseDocumentsResponse(response);

    // Assert
    expect(parse).toThrow(
      'documents[0].Title must be a string, null or undefined',
    );
  });

  it('reports the exact path of a corrupt attachment', () => {
    // Arrange
    const response = [{ Attachments: ['report.pdf', 42] }];

    // Act
    const parse = () => parseDocumentsResponse(response);

    // Assert
    expect(parse).toThrow(
      'documents[0].Attachments[1] must be a string or null',
    );
  });

  it('reports the exact path of a corrupt contributor', () => {
    // Arrange
    const response = [{ Contributors: [{ Name: 42 }] }];

    // Act
    const parse = () => parseDocumentsResponse(response);

    // Assert
    expect(parse).toThrow(
      'documents[0].Contributors[0].Name must be a string, null or undefined',
    );
  });
});
