import React from 'react';
import { useChatStore } from '../store/useChatStore';

const ReplySuggestions = ({ onSuggestionClick }) => {
    const { suggestions } = useChatStore();

    return (
        <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        className="btn btn-sm btn-outline rounded-full hover:btn-primary transition-all duration-200"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ReplySuggestions;
