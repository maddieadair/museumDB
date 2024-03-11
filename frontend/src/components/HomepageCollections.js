import Placeholder from "../assets/istockphoto-1147544807-612x612.jpg";
import {Link} from 'react-router-dom';

export default function HomepageCollections() {
    return (
        <div className="flex flex-col space-y-16 justify-center items-start px-32">
            <div className="flex flex-col">
                <h1 className="font-goudy-sm text-7xl">Collections</h1>
                <Link to='/Exhibitions' className="font-bold text-xl hover:text-cinnabar hover:transition-all duration-700 ease-in-out">View All &gt;</Link>
            </div>
            <div className="flex flex-row space-x-12">
                <div className="flex flex-col space-y-2">
                    <img src={Placeholder} alt="Placeholder" className="w-48"/>
                    <div className="flex flex-col">
                        <h5 className="text-2xl font-bold">Exhibition Name</h5>
                        <p className="">June 24, 2024 - Ongoing</p>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <img src={Placeholder} alt="Placeholder" className="w-48"/>
                    <div className="flex flex-col">
                        <h5 className="text-2xl font-bold">Exhibition Name</h5>
                        <p>June 24, 2024 - Ongoing</p>
                    </div>
                </div>
            </div>
        </div>
    )
}