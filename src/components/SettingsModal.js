import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const SettingsModal = ({ show, handleClose, showQuotes, toggleQuotes, darkMode, toggleDarkMode }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>⚙️ Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Check
            type="switch"
            label="Show Motivational Quotes"
            checked={showQuotes}
            onChange={toggleQuotes}
            className="mb-3"
          />
          <Form.Check
            type="switch"
            label="Dark Mode"
            checked={darkMode}
            onChange={toggleDarkMode}
            className="mb-3"
          />
        </Form>
        <Button variant="secondary" className="w-100 mt-3" onClick={handleClose}>
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default SettingsModal;
