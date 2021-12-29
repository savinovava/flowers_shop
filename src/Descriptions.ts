

type DescriptionType = "image" | "text" | "checkbox";

export interface Description {

    type: DescriptionType;

}

export interface TextDescription extends Description {

    text: string;

}

export interface ImageDescription extends Description {

    imageSrc: string;

}

export interface CheckboxDescription extends Description {

    name: string;
    variant: string[];

}
