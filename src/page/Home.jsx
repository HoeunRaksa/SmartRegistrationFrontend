import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <div className='card'>
                <div className='card-body'>
                    <h2 className='card-title'>Welcome to the University Portal</h2>
                    <p>This is the home page of the university portal. Explore our programs and register today!</p>
                    <div className='card-actions justify-end'>
                        <Link to="/ExamResul" className='btn btn-primary'>Get Started</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;