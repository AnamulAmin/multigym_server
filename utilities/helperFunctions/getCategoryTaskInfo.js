
export const getCategoryTasksInfo = async (tasks) => {
    const categoryTasksInfo = [];

    const uniqueCategoryIds = Array.from(new Set(tasks.map(task => task.category._id.toString())));

    for (const categoryId of uniqueCategoryIds) {
        const categoryTasks = tasks.filter(task => task.category._id.toString() === categoryId);

        const totalProjectedTime = categoryTasks.reduce((acc, task) => acc + (task.projectedTime || 0), 0);
        const totalCategoryTasks = categoryTasks.length;

        const remainingTasks = categoryTasks.filter(task => task.status !== "submitted" && task.status !== "completed");
        const remainingProjectedTime = remainingTasks.reduce((acc, task) => acc + (task.projectedTime || 0), 0);
        const remainingCategoryTasks = remainingTasks.length;

        categoryTasksInfo.push({
            categoryId,
            totalCategoryTasks,
            totalProjectedTime,
            remainingCategoryTasks,
            remainingProjectedTime
        });
    }

    return categoryTasksInfo;
}; 
