export const getCmsBlock = (content, key, fallback = {}) => {
    const block = content?.blocks?.find((item) => item.key === key);
    return block ? { ...fallback, ...block } : fallback;
};

export const getCmsSetting = (content, key, fallback = null) => {
    return content?.settings?.[key] ?? fallback;
};
