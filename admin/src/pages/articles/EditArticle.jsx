import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

/*Assets*/
import Images from "../../assets/Images";
import Icons from "../../assets/Icons";

/*Helpers*/
import Utils from "../../helpers/utils";

/*Components*/
import Inputs from "../../components/Inputs";
import InputWrapper from "../../components/Inputs/Wrapper";
import Loaders from '../../components/Loaders'
import Toasters from '../../components/Toasters'
import Buttons from '../../components/Buttons'
import Stepper from "../../components/Stepper";

/*Constant Data*/
import { LanguagesData } from '../../data/data'

/*handler*/
import ArticlesHandler from '../../handlers/articles/articles'

/* Sup Components */
import TitleEditSection from './TitleEditSection'
import ContentEditSection from './ContentEditSection'

const EditArticle = () => {

    const navigator = useNavigate()
    const articlesHandler = new ArticlesHandler()

    const { id } = useParams()

    const [isLoading, setIsLoading] = useState(false)
    const [warningAlert, setWarningAlert] = useState(false)
    const [warningAlertType, setWarningAlertType] = useState('error')
    const [warningAlertMessage, setwarningAlertMessage] = useState("Request failed, Please try again")

    const handleClose = () => {
        return navigator(-1)
    }

    const TableDopdownActions = [
        {
            id: 'edit',
            label: 'Edit',
            icon: Icons.default.edit,
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: Icons.default.delete,
        },

    ];

    const [Generating, setGenerating] = useState(false);
    const [GeneratingPercent, setGeneratingPercent] = useState(0);
    const [GeneratingLabel, setGeneratingLabel] = useState('Generating your article');
    const [CurrentStep, setCurrentStep] = useState(0);
    const StepperItems = [
        { title: 'Title & Outline', disable: Generating },
        { title: 'Article & SEO', disable: Generating }
    ]
    const onStepperChange = val => !Generating && setCurrentStep(val)


    const handleGenerateTitle = (data) => {
        setCurrentStep(1)
        setGenerating(true)
    }

    const [Article, setArticle] = useState(undefined)

    const getArticle = async (id) => {

        let response = await articlesHandler.get({ id })

        if (!response.success) {
            setWarningAlert(true)
            setWarningAlertType('error')
            setwarningAlertMessage(response.message)

            return
        }
        setArticle(response.data[0] || undefined)

    }

    useEffect(() => {
        getArticle(id)

    }, [])

    useEffect(() => {

        if (Generating) {



            setTimeout(() => {
                if (GeneratingPercent + 1 > 100) {
                    setGenerating(false)
                }
                else setGeneratingPercent(GeneratingPercent + 1)
            }, 600)
        }
    }, [GeneratingPercent, Generating])


    return (
        <>
            {isLoading ?

                <Loaders
                    props={{
                        isLabel: true
                    }} />
                : null}
            {warningAlert ?

                <Toasters
                    props={{
                        type: warningAlertType,
                        message: warningAlertMessage,
                        callback: () => setWarningAlert(false)
                    }} />
                : null}

            <div className="article-page-main">
                <div className="article-page-header">
                    <Buttons
                        type={'outline'}
                        icon={Icons.default.back_arrow}
                        width={'auto'}
                        label={'Back'}
                        callback={handleClose}
                    />
                    <Stepper
                        active={CurrentStep}
                        steps={StepperItems}
                        callback={onStepperChange}
                    />
                    <Buttons
                        type="primary"
                        icon={Icons.default.export}
                        width="auto"
                        label="PublishArticle"
                        disable={Generating}
                    />


                </div>
                {Generating ?
                    <div className="article-content-generating">
                        <Loaders
                            props={{
                                has_wrapper: false,
                                label: GeneratingLabel,
                                isLabel: true,
                                percentage: `${GeneratingPercent}%`
                            }} />

                    </div>
                    : CurrentStep == 1 ?
                        <ContentEditSection data={Article} callback={handleGenerateTitle} />
                        : <TitleEditSection data={Article} callback={handleGenerateTitle} />
                }
            </div>

        </>
    )
}

export default EditArticle;