import React,{useState,useEffect} from 'react';
import axios from 'axios';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Button} from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import './App.css';
const Register = Yup.object().shape({
  parentsName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  childName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  parentsEmail: Yup.string()
    .email('Invalid email')
    .required('Required'),
  childAge : Yup.number().typeError('must be number').required('required'),
  parentContact : Yup.string().matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/ , 'Please enter a valid number').required('required'),

});
const Main = () => {
  const [data, setData] = useState([]);
  const [date, setDate] = useState([]);
  const [Day, setDay] = useState([]);
  const [time, setTime] = useState([]);
  let myMap = [];
  let course = undefined;
  let myTime = [];
  async function fetchData() {
    const res = await axios("https://script.google.com/macros/s/AKfycbzJ8Nn2ytbGO8QOkGU1kfU9q50RjDHje4Ysphyesyh-osS76wep/exec");
    setData(res.data);
  }
  useEffect(() => {
    fetchData();
  },[]);
  function setCourseFunction(e){
    course = e;
    if(course !== undefined){
      for(let i=0;i<data[course-1].slots.length;i++){ 
        let s = data[course-1].slots[i].slot;
        s = parseInt(s,10); 
        const d = new Date(s);
        let  s1 = d.getMonth().toString()+ '/' + d.getDate().toString()+'/'+d.getUTCFullYear().toString();
        let hr,min;
        if(d.getMinutes()<10){
          min = '0' + d.getMinutes().toString();
        }else{
          min = d.getMinutes().toString();
        }
        hr = d.getHours().toString();
        myMap.push(s1);
        let obj = {day : s1 ,hours:hr,minutes:min};
        myTime.push(obj);
      }
      let d = new Date(myMap[0]);
      d.setDate(14);
      d.setMonth(7);
      let  s1 = d.getMonth().toString()+'/'+d.getDate().toString()+'/'+d.getFullYear().toString();
      let hr='10';
      let min="30";
      myMap.push(s1);
      let obj = {day : s1 ,hours:hr,minutes:min};
      myTime.push(obj);
      let unique = [...new Set(myMap)];
      setDate(unique);
      setDay(myTime)
    }
  }
  function dateSelectFunction(e){
    let map = [];
    let date1 = new Date(e);
    let selectedDate = date1.getDate();
    let todayDate = new Date();
    let s = todayDate.getDate();
    let Difference_In_Time = todayDate.getTime() - date1.getTime(); 
    let Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if(Difference_In_Days>7) {
      let str = 'Maximum delay is 7 days';
      alert(str);
      return;
    }
    for(let i=0;i<Day.length;i++){
      if(Day[i].day===e){
        let obj = { hours : Day[i].hours, minutes: Day[i].minutes};
        map.push(obj);
      }
    }
    setTime(map);
  }
  function timeSelectFunction(e){
    let index = e.selectedIndex;
    console.log(time[index]);
    let date = new Date();
    let date1 = new Date();
    date1.setHours(time[index].hours);
    date1.setMinutes(time[index].minutes)
    console.log(date1);
    let diff =(date1.getTime() - date.getTime()) / 1000;
    diff /= 60;
    let totMin = Math.abs(Math.round(diff));
    if(totMin<240){
      alert('Earliest slot we can show should be minimum 4 hours from now');
    }
    return;
  }
  return (
    <div>
    {(data.length===0) ?   <Skeleton circle = {true} width = {150} height = {150} style={{margin: 'auto',
    display: 'block'}} count={1}/> :
      <div className = 'main'>
        <div className="register">Book a trail on <a style={{color:'white'}} href="http://notchup.co/">notchUp</a></div>
        <div className="form">
          <Formik
            initialValues={{ 
              parentsName: '',
              parentsEmail: '',
              parentContact : '',
              childName: '',
              childAge : '',
            }}
            validationSchema={Register}
            onSubmit={(values, { setSubmitting,resetForm }) => {
              document.location.reload();
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              resetForm,
              validationSchema
            }) => (
               <form onSubmit={handleSubmit} style={{height:'100%'}}>
                <p className="heading">Parent's name</p>
                <Field
                  className="input"
                  placeHolder ="Parent's Name"
                  type="text"
                  name="parentsName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {touched.parentsName && errors.parentsName &&
                  <p style={{ fontSize: 20, color: 'red',textAlign : 'center' }}>{errors.parentsName}</p>
                }
                <p className="heading">Parent's E-mail</p>
                <Field
                  type="text"
                  placeHolder ="Parent's Email"
                  className="input"
                  name="parentsEmail"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {touched.parentsEmail && errors.parentsEmail &&
                  <p style={{ fontSize: 20, color: 'red',textAlign : 'center' }}>{errors.parentsEmail}</p>
                }
                <p className="heading">Parent's Contact Number</p>
                <Field
                  type="text"
                  placeHolder ="Parent's Contact Number"
                  className="input"
                  name="parentContact"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {touched.parentContact && errors.parentContact &&
                  <p style={{ fontSize: 20, color: 'red',textAlign : 'center' }}>{errors.parentContact}</p>
                }
                <p className="heading">Child's Name</p>
                <Field
                  type="text"
                  placeHolder ="Child's Name"
                  className="input"
                  name="childName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {touched.childName && errors.childName &&
                  <p style={{ fontSize: 20, color: 'red',textAlign : 'center' }}>{errors.childName}</p>
                }
                <p className="heading">Child's Age</p>
                <Field
                  type="text"
                  placeHolder ="Child's Age"
                  className="input"
                  name="childAge"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {touched.childAge && errors.childAge &&
                  <p style={{ fontSize: 20, color: 'red',textAlign : 'center' }}>{errors.childAge}</p>
                }
                <p className="selectionHeading">Select course</p>
                <div className="selection">
                  <select 
                    value = {course}
                    className = "selectionClass"
                    onChange={(e) => setCourseFunction(e.target.value)}
                  >
                    <option value={data[0].course_id}>{data[0].course_name}</option>
                    <option value={data[1].course_id}>{data[1].course_name}</option>
                    <option value={data[2].course_id}>{data[2].course_name}</option>
                    <option value={data[3].course_id}>{data[3].course_name}</option>
                    <option value={data[4].course_id}>{data[4].course_name}</option>
                  </select>
                </div>
                <p className="selectionHeading">Select Date</p>
                <div className="selection">
                  {date.length === 0 ? <select className = "selectionClass"> Date
                    <option >Please select Course</option>
                  </select>
                  : 
                    <div>
                      <select className = "selectionClass" onChange={(e) => dateSelectFunction(e.target.value)}>
                        {date.map((val,index) =>{
                            return(<option key={index} value={val}>{val}</option>)
                        })}
                        </select>
                    </div>
                  }
                </div>
                <p className="selectionHeading">Select Slot</p>
                <div className="selection">
                  {time.length === 0 ? <select className = "selectionClass"> select date
                    <option >Please select date</option>
                  </select>
                  : 
                    <div>
                      <select className = "selectionClass" onChange={(e) => timeSelectFunction(e.target)}>
                        {time.map((val,index) =>{
                            return(<option key={index} value={val}>{val.hours+':'+val.minutes}</option>)
                        })}
                        </select>
                    </div>
                  }
                </div>
                {errors.password && touched.password && errors.password}
                <Button  variant="outline-primary" className='button' type="submit" disabled={isSubmitting}>
                  Submit
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    }
    </div>
  );
};
export default Main;