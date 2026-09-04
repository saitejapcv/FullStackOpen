import Header from "./Header"
import Content from "./Content"
import Total from "./Total"
const Courses = ({ courses }) => {
    return (

        <div>
            {courses.map(course =>
                <div key={course.id}>
                    <Header text={course.name} />
                    <Content parts={course.parts} />
                    <Total parts={course.parts} />
                </div>
            )}
        </div>
    )
}

export default Courses