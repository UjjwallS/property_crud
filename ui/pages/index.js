import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [formData, setFormData] = useState({
    builder: '',
    website: '',
    data: [{ project_name: '', location: '', description: '', other_info: {} }],
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/properties');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      const response = await fetch(`http://127.0.0.1:8000/properties/${index}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
      fetchProperties();
    } catch (err) {
      alert('Error deleting property');
    }
  };

  const handleEdit = (index) => {
    setCurrentEditIndex(index);
    const property = properties[index];
    setFormData({
      builder: property.builder,
      website: property.website,
      data: Array.isArray(property.data) && property.data.length > 0
        ? property.data
        : [{ project_name: '', location: '', description: '', other_info: {} }],
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/properties/${currentEditIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to edit');
      fetchProperties();
      setShowEditModal(false);
    } catch (err) {
      alert('Error saving property');
    }
  };

  const handleAdd = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to add');
      fetchProperties();
      setShowAddModal(false);
    } catch (err) {
      alert('Error adding property');
    }
  };

  const openAddModal = () => {
    setFormData({
      builder: '',
      website: '',
      data: [{ project_name: '', location: '', description: '', other_info: {} }],
    });
    setShowAddModal(true);
  };

  return (
    <Container className="mt-4">
      <h1>Property Management</h1>
      <Button variant="primary" className="mb-3" onClick={openAddModal}>
        Add Property
      </Button>

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
                  {Array.isArray(property.data) &&
                    property.data.map((project, i) => (
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
                  <Button variant="danger" size="sm" onClick={() => handleDelete(index)} className="me-2">
                    Delete
                  </Button>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(index)}>
                    Edit
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        !loading && <p>No properties available</p>
      )}

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Builder Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.builder}
                onChange={(e) => setFormData({ ...formData, builder: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.data[0].project_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    data: [{ ...formData.data[0], project_name: e.target.value }],
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={formData.data[0].location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    data: [{ ...formData.data[0], location: e.target.value }],
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={formData.data[0].description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    data: [{ ...formData.data[0], description: e.target.value }],
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Builder Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.builder}
                onChange={(e) => setFormData({ ...formData, builder: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="text"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Project Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.data[0].project_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    data: [{ ...formData.data[0], project_name: e.target.value }],
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                value={formData.data[0].location}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    data: [{ ...formData.data[0], location: e.target.value }],
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={formData.data[0].description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    data: [{ ...formData.data[0], description: e.target.value }],
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
