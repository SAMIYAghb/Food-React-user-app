import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Menu, MenuItem, Sidebar } from 'react-pro-sidebar';
import { Link, useNavigate } from 'react-router-dom';
import logoUser from '../../../assets/images/logoUser.png';
import ChangePass from './../../../AuthModule/Components/ChangePass/ChangePass';

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  // modale
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // modal
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };
 
  return (
    <div className="sidebar-container">
      {/* modal */}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <Modal.Header closeButton></Modal.Header>
          <ChangePass handleClose={handleClose}/>
        </Modal.Body>
      </Modal>
      {/*end modal */}
      
    <Sidebar collapsed={isCollapsed}>
        <Menu  menuItemStyles={{
            button: {
              [`&.active`]: {
                backgroundColor: '#13395e',
                color: '#b6c8d9',
              },
            },
          }}>
          <MenuItem onClick={handleToggle}
          icon={<img className='icon-img-side ' src={logoUser} alt="logo-img-toggle" />}  
          component={<Link to="/dashboard" />}>
          </MenuItem>
          <MenuItem icon={<i className='fa fa-home' aria-hidden='true'></i>} component={<Link to="/dashboard" />}> 
          Home</MenuItem>
          <MenuItem icon={<i className='fa fa-list' aria-hidden='true'></i>} component={<Link to="/dashboard/recipes" />}> 
          Recipes</MenuItem>
          <MenuItem icon={<i className='fa fa-heart' aria-hidden='true'></i>} component={<Link to="/dashboard/favorites" />}> 
          Favorites</MenuItem>
        </Menu>
    </Sidebar>
    </div>
  )
}

export default SideBar
