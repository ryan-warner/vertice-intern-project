import { Button } from 'antd'

export default function Header() {
    return (
        <div className="flex w-full justify-between items-center">
            <div className="text-4xl font-bold pb-4">
                First Credit Union
            </div>
            <Button type="primary" className="rounded-xl" >
                BUTTON
            </Button>
        </div>
    )
}