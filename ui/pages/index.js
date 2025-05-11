import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/properties')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      })
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="mt-4">
      <h1>Property Management</h1>
      {loading && <p>Loading properties...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {properties.length > 0 ? (
        <Row>
          {properties.map((property, index) => (
            <Col key={index} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{property.builder}</Card.Title>
                  <Card.Link href={property.website} target="_blank">
                    Visit Website
                  </Card.Link>
                  <hr />
                  {property.data.projects.map((project, i) => (
                    <div key={i}>
                      <h5>{project.project_name}</h5>
                      <p>{project.location}</p>
                      <p>{project.description}</p>
                      {project.other_info?.images?.[0] && (
                        <img
                          src={project.other_info.images[0]}
                          alt={project.project_name}
                          style={{ width: '100%', height: 'auto' }}
                        />
                      )}
                      <hr />
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        !loading && <p>No properties available</p>
      )}
    </Container>
  );
}
