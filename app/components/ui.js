export function Card({ children }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow">
            {children}
        </div>
    )
}

export function Button({ children, onClick }) {
    return (
        <button
            onClick={onClick}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
            {children}
        </button>
    )
}

export function Input(props) {
    return (
        <input
            {...props}
            className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
    )
}