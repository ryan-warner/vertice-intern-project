export default function Header(props) {
    return (
        <div className="flex sm:flex-row gap-2 justify-start flex-col w-full sm:justify-between items-center p-4 mb-4 shadow-lg bg-[#1890ff]">
            <div className="flex flex-col self-start sm:self-center text-white">
                <div className="text-4xl font-bold">
                    First Credit Union
                </div>
                <div className="font-semibold">Powered by Vertice AI</div>
            </div>
            <div className="flex flex-col justify-end self-start sm:self-center text-white">
                <div className="self-end text-lg font-semibold">{`Total Members: ${props.totalMembers.toLocaleString("en-US")}`}</div>
                <div className="self-end text-lg font-semibold">{`Total Products: ${props.totalProducts.toLocaleString("en-US")}`}</div>
            </div>
        </div>
    )
}