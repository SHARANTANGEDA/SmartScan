import React from 'react';
// import '../404-star-wars-bb-8/js/404'
import '../404-star-wars-bb-8/css/404.css'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <body >

    <main style={{ background: '#869F9D',overflow: 'hidden',width: '100%',minHeight: '100%',color: '#FFF'}}>
      <div className='sky' id="message" style={{minHeight:'100%', width: '100%',height: '100%',color: '#FFF',zIndex:'11',
        background: '#869F9D'}}>
        <h3>ERROR</h3>
        <h1>404</h1>
        <p id="quote">"Why Does Everyone Want To <a href="#">Go Back</a> To Jakku?!"</p>
      </div>
    {/*</div>*/}

      <div className="sand"/>
      <div className="bb8">
        <div className="antennas">
          <div className="antenna short"></div>
          <div className="antenna long"></div>
        </div>
        <div className="head">
          <div className="stripe one"></div>
          <div className="stripe two"></div>
          <div className="eyes">
            <div className="eye one"></div>
            <div className="eye two"></div>
          </div>
          <div className="stripe three"></div>
        </div>
        <div className="ball">
          <div className="lines one"></div>
          <div className="lines two"></div>
          <div className="ring one"></div>
          <div className="ring two"></div>
          <div className="ring three"></div>
        </div>
        <div className="shadow"></div>
      </div>
    </main>

    </body>
  );
};

// {/*<body style={{ background: '#869F9D',overflow: 'hidden'}}>*/}
// {/*<div style={{minHeight:'100%', width: '100%',height: '100%',color: '#FFF'}}>*/}
//
// {/*  <div id="message" style={{ background: '#869F9D',overflow: 'hidden'}}>*/}
// {/*    <div className="shadow" style={{ background: '#869F9D',overflow: 'hidden'}}/>*/}
//
// {/*    <div className="sand"/>*/}
// {/*    <div className="bb8">*/}
// {/*      <div className="antennas">*/}
// {/*        <div className="antenna short"/>*/}
// {/*        <div className="antenna long"/>*/}
// {/*      </div>*/}
// {/*      <div className="head">*/}
// {/*        <div className="stripe one"/>*/}
// {/*        <div className="stripe two"/>*/}
// {/*        <div className="eyes">*/}
// {/*          <div className="eye one"/>*/}
// {/*          <div className="eye two"/>*/}
// {/*        </div>*/}
// {/*        <div className="stripe three"/>*/}
// {/*      </div>*/}
// {/*      <div className="ball">*/}
// {/*        <div className="lines one"/>*/}
// {/*        <div className="lines two"/>*/}
// {/*        <div className="ring one"/>*/}
// {/*        <div className="ring two"/>*/}
// {/*        <div className="ring three"/>*/}
// {/*      </div>*/}
// {/*    </div>*/}
// {/*    <h3>ERROR</h3>*/}
// {/*    <h1>404</h1>*/}
// {/*    <p id="quote">"Why Does Everyone Want*/}
// {/*      <Link to='/dashboard'*/}
// {/*            style={{ color: '#333', fontFamily: "'Raleway', sans-serif" }}>Go Back</Link> To Jakku?!"</p>*/}
//
// {/*  </div>*/}
// {/*</div>*/}
//
// {/*</body>*/}
//
