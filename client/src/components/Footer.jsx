//Footer Section
export default function Footer() {
    return (
        <footer className="w-full bg-dark-navy text-white py-6">
            <div className="max-w-6xl mx-auto px-4 flex flex-col items-center text-center">
                <p className="text-lg font-semibold">Southern Gas Services</p>
                <p className="text-sm text-light-blue mt-1">
                    &copy; {new Date().getFullYear()} Southern Gas Services. All right reserved.
                </p>
            </div>
        </footer>
    );
}