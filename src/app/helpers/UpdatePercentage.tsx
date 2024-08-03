export async function UpdatePercentage(id: string, percentage: number) {
    try {
        const response = await fetch(`/api/course/${id}`, { // Adjust the endpoint if necessary
            method: 'PUT', // or 'PATCH' based on your API design
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ percentage }) // Wrapping percentage in an object
        });

        if (!response.ok) {
            throw new Error('Failed to update percentage');
        }

        console.log("function called");
        return await response.json();
    } catch (error) {
        console.error('Error updating percentage:', error);
        throw error; // Rethrow the error to handle it at the call site
    }
}
