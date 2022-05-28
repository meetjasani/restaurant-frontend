import React, { createContext, useContext, useState } from 'react'
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setToggleMenu } from '../../redux/actions/toggleMenuAction';
import { Menu, Dropdown } from 'antd';
import Profile from '../../component/Profile';
import { ApiPatch } from '../../helper/API/ApiData';
import Swal from 'sweetalert2';
import AuthStorage from '../../helper/AuthStorage';
import { changeLoginState } from '../../redux/actions/loginAction';
import { useHistory } from 'react-router-dom';
import { CheckboxContext } from '../../CheckboxContext';

const initialData = {
  password: "",
  repeat_password: ""
}

const Header = ({ }) => {
  const { setCheckboxData } = useContext(CheckboxContext);
  const [formData, setFormData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");



  const { is_toggleMenu } = useSelector(
    (state) => state.menuToggle
  );

  const { userData } = useSelector((state) => state.userData);

  const dispatch = useDispatch();
  let history = useHistory();

  const togglemenubtn = () => {
    if (is_toggleMenu) {
      dispatch(setToggleMenu(false));
    } else {
      dispatch(setToggleMenu(true));
    }
  };
  const [data, setData] = useState({
    type: ""
  })
  const dropdown = [
    { label: "Change Password", value: "Change Password" },
    { label: "Log Out", value: "Log Out" }
  ]


  const chnagepass = () => {
    setOpen(true)
  }

  const logoutheader = () => {
    Swal.fire({
      title: 'Logout',
      text: 'Are You Sure to Logout!',
      // imageUrl: '/images/login-img-4.png',
      // imageWidth: 250,
      // imageHeight: 250,
      // imageAlt: 'Logout Iamge',
      showCancelButton: true,
      confirmButtonColor: '#ff6877',
      cancelButtonColor: '#404040',
      confirmButtonText: 'Yes, Logout!'
    })
      .then((result) => {
        if (result.isConfirmed) {
          logout();
        }
      })
  }

  const logout = () => {
    AuthStorage.deauthenticateUser();
    dispatch(changeLoginState(false));
    history.push("/");
  }



  const handleClose = () => {
    setErrMsg("");
    setFormData(initialData);
    setOpen(false);
  };

  const onChange = (e) => {
    const _formData = { ...formData }
    _formData[e.target.id] = e.target.value;
    setFormData(_formData)
  }


  const handleFormSubmit = () => {
    setErrMsg('');
    ApiPatch('user/p', formData).then((res) => {
      window.alert('Password Updated')
      handleClose();
    }).catch((error) => {
      setErrMsg(error.response.data.message)
    });
  }


  const link = (
    <Menu className='pc-menusec'>
      <Menu.Item key="0">
        <a href="#" onClick={chnagepass}>Change Password</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="#" onClick={logoutheader}>Log Out</a>
      </Menu.Item>
    </Menu>
  );

  const menu = (
    <Menu className='antd-menu pc-datepiker'>
      <Menu.Item>
        <div className='flex items-center justify-between menu-datepicker '>
          <span class="material-icons">
            arrow_back_ios
          </span>
          <div className='text-center'>
            <h1 className='font-bold'>
              Today
            </h1>
            <span>
              14:00
            </span>
          </div>
          <span class="material-icons ">
            arrow_forward_ios
          </span>
        </div>
      </Menu.Item>
      <Menu.Item>

        <div className='flex items-center justify-between'>
          <div className='flex items-center '>
            <span className="material-icons material">
              account_circle
            </span>
            <p className='font-medium	text-base mb-0'>2</p>
          </div>
          <label className='font-medium	'> Dianne </label>
          <label className='font-medium	'>14:00</label>
        </div>
      </Menu.Item>
    </Menu >
  );

  const resepi = (
    <Menu className='recepie-menu pc-dropmenu'>
      <Menu.Item>
        <div className='flex items-center	justify-between'>
          <img src='https://social.bigbazaar.com/data/fb_images/BigBazaar/10158116014522787.jpg' alt='' className='w-16 h-16 rounded-md object-contain' />

          <p className='font-medium mb-0'> Tamil Thali </p>
          <label className='font-medium	'> 180 </label>
        </div>
      </Menu.Item>
      <Menu.Item>
        <div className='flex items-center	justify-between'>
          <img src='https://social.bigbazaar.com/data/fb_images/BigBazaar/10158116014522787.jpg' alt='' className='w-16 h-16 rounded-md object-contain' />

          <p className='font-medium mb-0'> Tamil Thali </p>
          <label className='font-medium	'> 180 </label>
        </div>
      </Menu.Item>
    </Menu>
  );


  const handleChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    // debugger;
    setCheckboxData(value);
  }

  return (
    <>
      <Container fluid>
        <div className={!is_toggleMenu ? "flex items-center justify-between sec-header pc-sec-header" : "width-set flex items-center justify-between"}>
          <div className='flex items-center pc-flex-center'>
            <div className='h-6 m-2 cursor-pointer'>

              {is_toggleMenu && <span className="material-icons pc-closemega-icon" onClick={togglemenubtn}>
                close
              </span>
              }
              {!is_toggleMenu && <span className="material-icons" onClick={togglemenubtn}>
                menu0
              </span>}
            </div>








            {!is_toggleMenu && <div className="profile-picture ml-1">
              <img
                src={process.env.REACT_APP_IMAGE_URL + userData?.license.logo === "" ? "/images/logo.svg" : process.env.REACT_APP_IMAGE_URL + userData?.license.logo}
                onError={(e) => { e.target.onerror = null; e.target.src = "/images/logo.svg" }}
                alt="" />
              <h3>{userData?.license.name}</h3>
            </div>}





            <div className='flex items-center ml-10   cursor-pointer '>
              <label className="checkbox-container">
                Marge Table
                <input type='checkbox' name="check" onChange={(e) => handleChange(e)} />
                <span className="checkmark">  </span>
              </label>
            </div>

            <div className=' ml-12  flex items-center justify-between pc-margin-sec'>

              <Dropdown overlay={menu} trigger={['click']}>
                <div className='p-4'>
                  <a href='#' className='flex items-center text-black justify-between'>
                    <> Menu </>
                    <span className="material-icons ml-5 pc-icon-sec">
                      arrow_drop_down
                    </span>
                  </a>
                </div>
              </Dropdown>

              <Dropdown overlay={resepi} trigger={['click']} className="ml-12 pc-margin-sec">
                <a href='#' className='flex items-center text-black '>
                  <>Dropdown</>
                  <span className="material-icons ml-5">
                    arrow_drop_down
                  </span>
                </a>
              </Dropdown>







              {/* <Dropdown className='menu-dropdown'>
                <Dropdown.Toggle>
                  <h1>Dropdown</h1>
                  <span className="material-icons">
                    arrow_drop_down
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className='menu-dropdown-menu'>
                  <Dropdown.Item>
                    <div className='flex items-center justify-between menu-datepicker'>
                      <span class="material-icons">
                        arrow_back_ios
                      </span>
                      <div className='text-center'>
                        <h1 className='font-bold'>
                          Today
                        </h1>
                        <span>
                          14:00
                        </span>
                      </div>
                      <span class="material-icons">
                        arrow_forward_ios
                      </span>
                    </div>

                  </Dropdown.Item>
                  <Dropdown.Item className=''>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center '>
                        <span className="material-icons material">
                          account_circle
                        </span>
                        <p className='font-medium	text-base'>2</p>
                      </div>
                      <label className='font-medium	'> Dianne </label>
                      <label className='font-medium	'>14:00</label>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <span className="material-icons material text-xs 	">
                          account_circle
                        </span>
                        <p className='	font-medium		text-base	'>2</p>
                      </div>
                      <label className='font-medium	'> Dianne </label>
                      <label className='font-medium	'>14:00</label>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <span className="material-icons material text-xs 	">
                          account_circle
                        </span>
                        <p className='	font-medium		text-base	'>2</p>
                      </div>
                      <label className='font-medium	'> Dianne </label>
                      <label className='font-medium	'>14:00</label>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <span className="material-icons material text-xs 	">
                          account_circle
                        </span>
                        <p className='font-medium	text-base'>2</p>
                      </div>
                      <label className='font-medium	'> Dianne </label>
                      <label className='font-medium	'>14:00</label>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Dropdown className='ml-5 list-dropdown'>
                <Dropdown.Toggle>
                  <h1>Dropdown</h1>
                  <span className="material-icons">
                    arrow_drop_down
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className='list-dropdown-menu'>
                  <Dropdown.Item>
                    <div className='flex items-center	justify-between'>
                      <img src='https://social.bigbazaar.com/data/fb_images/BigBazaar/10158116014522787.jpg' alt='' />

                      <p className='font-medium'> Tamil Thali </p>
                      <label className='font-medium	'> 180 </label>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <div className='flex items-center	justify-between'>
                      <img src='https://social.bigbazaar.com/data/fb_images/BigBazaar/10158116014522787.jpg' alt='' />

                      <p className='font-medium'> Tamil Thali </p>
                      <label className='font-medium	'> 180 </label>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <div className='flex items-center	justify-between'>
                      <img src='https://social.bigbazaar.com/data/fb_images/BigBazaar/10158116014522787.jpg' alt='' />

                      <p className='font-medium'> Tamil Thali </p>
                      <label className='font-medium	'> 180 </label>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <div className='flex items-center	justify-between'>
                      <img src='https://social.bigbazaar.com/data/fb_images/BigBazaar/10158116014522787.jpg' alt='' />

                      <p className='font-medium'> Tamil Thali </p>
                      <label className='font-medium	'> 180 </label>
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <div className='flex items-center	justify-between'>
                      <img src='https://social.bigbazaar.com/data/fb_images/BigBazaar/10158116014522787.jpg' alt='' />

                      <p className='font-medium'> Tamil Thali </p>
                      <label className='font-medium	'>   180 </label>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown> */}


            </div>
          </div>


          <div className='flex items-center pc-checkbox'>
            <div className='pc-btn-sec'>
              <button className="Avelabel-watiter flex items-center">
                <span className="material-icons">
                  noise_control_off
                </span>
                6/56(%9) </button>
              <button className='watiter flex items-center'>
                <span className="material-icons">
                  noise_control_off
                </span>
                2 waiter
              </button>
            </div>
            <button className='reservation '> + New reservation </button>
            <button className='walkin bg-slate-300 	'> walk in </button>


            <Dropdown overlay={link} trigger={['click']}>
              <a className="ant-dropdown-link flex items-center pc-ant-link" onClick={e => e.preventDefault()}>
                <img src="https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_960_720.jpg" />
                <span className="material-icons ml-3	">
                  arrow_drop_down
                </span>
              </a>
            </Dropdown>
          </div>
        </div>
      </Container>
      <Profile
        open={open}
        handleClose={handleClose}
        data={formData}
        name={userData?.username}
        onChange={onChange}
        handleFormSubmit={handleFormSubmit}
        errMsg={errMsg}
      />

     
    </>
  );
};

export default Header
