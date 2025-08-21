import { Steps } from 'antd';

const Stepper = ({ steps = [], active = 0, size = "small", callback = () => { } }) => {

    return (
        <Steps

            className="article-page-header-steps"
            size="small"
            current={active}
            onChange={callback}
            items={steps}
            style={{
                width: '80%'
            }}
        />
    )
}

export default Stepper