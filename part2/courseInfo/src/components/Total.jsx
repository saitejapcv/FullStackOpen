const Total = ({ parts }) => {
    const total = parts.reduce((s, p) => {
        console.log('what is happening', s, p)
        return s + p.exercises
    }, 0)

    return (
        <p>Total of {total} exercises</p>
    )
}

export default Total